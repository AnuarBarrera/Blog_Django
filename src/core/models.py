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
from djongo import models
from bson import ObjectId

# Create your models here.
#Model Banner Deportivo
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

#Model CV virtual  
class Skill(models.Model):
    TIPO_CHOICES = [
        ('HARD', 'Habilidad Técnica'),
        ('SOFT', 'Habilidad Blanda')
    ]
    
    NIVEL_CHOICES = [
        (1, 'Básico'),
        (2, 'Intermedio'),
        (3, 'Avanzado')
    ]
    
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=4, choices=TIPO_CHOICES)
    nivel = models.IntegerField(choices=NIVEL_CHOICES)
    descripcion = models.TextField(help_text="Describe cómo has aplicado esta habilidad y logros relacionados")
    
    def __str__(self):
        return f"{self.nombre} - {self.get_nivel_display()}"

class Proyecto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    tecnologias = models.ManyToManyField(Skill)
    fecha = models.DateField()
    url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class ExperienciaLaboral(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)  # Asegura que use ObjectId
    empresa = models.CharField(max_length=200)
    cargo = models.CharField(max_length=200)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    en_curso = models.BooleanField(default=False)
    descripcion = models.TextField()

    def __str__(self):
        return f"{self.cargo} en {self.empresa}"