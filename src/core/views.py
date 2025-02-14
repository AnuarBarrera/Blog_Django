from django.shortcuts import render
from django.http import JsonResponse
from .models import ResultadoDeportivo
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def home(request):
    return render(request, 'index.html')
    
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