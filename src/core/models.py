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

from django.db import models

# Create your models here.
class ResultadoDeportivo(models.Model):
    ESTADO_CHOICES = [
        ('pre', 'Próximo'),
        ('in', 'En Vivo'),
        ('post', 'Finalizado'),
    ]
    
    deporte = models.CharField(max_length=50)
    equipo_local = models.CharField(max_length=100)
    equipo_visitante = models.CharField(max_length=100)
    resultado = models.CharField(max_length=20)
    en_vivo = models.BooleanField(default=False)
    estado = models.CharField(max_length=4, choices=ESTADO_CHOICES)
    fecha = models.DateTimeField()
    hora = models.CharField(max_length=5)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resultados_deportivos'
        unique_together = ['deporte', 'equipo_local', 'equipo_visitante', 'fecha']
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['fecha']),
        ]

    def __str__(self):
        return f"{self.equipo_local} vs {self.equipo_visitante} - {self.resultado}"
        
    @classmethod
    def limpiar_resultados_antiguos(cls):
        limite_tiempo = timezone.now() - timezone.timedelta(hours=24)
        cls.objects.filter(fecha_actualizacion__lt=limite_tiempo).delete()
