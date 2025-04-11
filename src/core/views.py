"""
  Copyright [2005] [anuar eduardo barrera yeeben]
 
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
"""

from django.shortcuts import render
from django.http import JsonResponse
from .models import ResultadoDeportivo
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import ExperienciaLaboral, Proyecto, Skill
import os
import subprocess
from django.conf import settings

# Create your views here.
#View del home
def home(request):
    return render(request, 'index.html')

#Endpoint para limpiar resultados antiguos
#Views Banner Deportivo
@csrf_exempt
@require_http_methods(["POST"])
def limpiar_resultados(request):
    try:
        limite_tiempo = timezone.now() - timezone.timedelta(hours=24)
        eliminados, _ = ResultadoDeportivo.objects.filter(fecha_actualizacion__lt=limite_tiempo).delete()
        return JsonResponse({"status": "success", "eliminados": eliminados})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)

#Carga y consulta de la DB
@csrf_exempt
@require_http_methods(["GET", "POST"])
def resultados_deportivos(request):
    if request.method == "POST":
        try:
            datos = json.loads(request.body)
            for resultado in datos:
                ResultadoDeportivo.objects.update_or_create(
                    deporte=resultado['deporte'],
                    equipo_local=resultado['equipoLocal'],
                    equipo_visitante=resultado['equipoVisitante'],
                    fecha=resultado.get('fecha'),
                    estado=resultado.get('estado'),
                    defaults={
                        'resultado': resultado['resultado'],
                        'en_vivo': resultado['enVivo'],
                        'hora': resultado.get('hora', '')
                    }
                )
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    
    else:  # GET
        resultados = ResultadoDeportivo.objects.all().values(
            'deporte', 
            'equipo_local', 
            'equipo_visitante', 
            'resultado', 
            'en_vivo',
            'estado',
            'fecha',
            'hora'
        )
        
        resultados_formateados = [{
            'deporte': r['deporte'],
            'equipoLocal': r['equipo_local'],
            'equipoVisitante': r['equipo_visitante'],
            'resultado': r['resultado'],
            'enVivo': r['en_vivo'],
            'estado': r['estado'],
            'fecha': r['fecha'],
            'hora': r['hora']
        } for r in resultados]
        return JsonResponse(resultados_formateados, safe=False)

#Views CV virtual
def HistoriaLaboral(request):
    experiencias = ExperienciaLaboral.objects.order_by('-fecha_inicio')
    proyectos = Proyecto.objects.order_by('-fecha')
    skills = Skill.objects.all()

    return render(request, 'HistoriaLaboral.html', {
        'experiencias': experiencias,
        'proyectos': proyectos, 
        'skills': skills
    })

#views de la consola de proyectos

# Directorio donde están almacenados tus scripts
SCRIPTS_DIR = os.path.join(settings.BASE_DIR, 'scripts')

def get_available_scripts():
    """
    Obtiene la lista de scripts disponibles en el directorio de scripts
    """
    scripts = []
    # Listamos los scripts de Python (*.py) y JavaScript (*.js)
    for file in os.listdir(SCRIPTS_DIR):
        if file.endswith('.py') or file.endswith('.js'):
            scripts.append({
                'name': file,
                'type': 'python' if file.endswith('.py') else 'javascript'
            })
    return scripts

def console_view(request):
    """
    Vista principal que muestra la consola interactiva
    """
    scripts = get_available_scripts()
    context = {'scripts': scripts}
    template_name = 'consola.html' # Nombre del template a renderizar

   # Renderizar
    response = render(request, template_name, context)
    return response

def execute_script(request):
    """
    Endpoint para ejecutar scripts desde la consola
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        command = data.get('command', '')
        
        # Verificamos si el comando es para ejecutar un script
        if command.startswith('run '):
            script_name = command[4:].strip()  # Extrae el nombre del script
            
            # Verificamos que el script exista
            script_path = os.path.join(SCRIPTS_DIR, script_name)
            if not os.path.exists(script_path):
                return JsonResponse({'output': f'Error: El script "{script_name}" no existe.'})
            
            # Ejecutamos el script según su tipo
            if script_name.endswith('.py'):
                try:
                    # Ejecutar script de Python
                    result = subprocess.run(['python', script_path], 
                                           capture_output=True, 
                                           text=True)
                    output = result.stdout
                    if result.stderr:
                        output += f"\nError: {result.stderr}"
                except Exception as e:
                    output = f"Error al ejecutar el script: {str(e)}"
            
            elif script_name.endswith('.js'):
                try:
                    # Ejecutar script de JavaScript con Node.js
                    result = subprocess.run(['node', script_path], 
                                           capture_output=True, 
                                           text=True)
                    output = result.stdout
                    if result.stderr:
                        output += f"\nError: {result.stderr}"
                except Exception as e:
                    output = f"Error al ejecutar el script: {str(e)}"
            
            return JsonResponse({'output': output})
        
        # Si no es un comando para ejecutar script, podemos manejar otros comandos
        elif command == 'list':
            # Comando para listar los scripts disponibles
            scripts = get_available_scripts()
            output = "Scripts disponibles:\n"
            for script in scripts:
                output += f"- {script['name']} ({script['type']})\n"
            return JsonResponse({'output': output})
        
        elif command == 'help':
            # Comando de ayuda
            output = """Comandos disponibles:
- run <script_name>: Ejecuta el script especificado
- list: Muestra la lista de scripts disponibles
- help: Muestra esta ayuda
- clear: limpia la consola
"""
            return JsonResponse({'output': output})
        
        else:
            return JsonResponse({'output': f'Comando desconocido: {command}\nEscribe "help" para ver los comandos disponibles.'})
    
    return JsonResponse({'output': 'Método no permitido'}, status=405)