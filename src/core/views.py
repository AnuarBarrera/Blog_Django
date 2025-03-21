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

# Create your views here.
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

    experiencias = ExperienciaLaboral.objects.all()
    proyectos = Proyecto.objects.all()
    skills = Skill.objects.all()

    return render(request, 'HistoriaLaboral.html', {
        'experiencias': experiencias,
        'proyectos': proyectos, 
        'skills': skills
    })