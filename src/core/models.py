from django.db import models

# Create your models here.
class ResultadoDeportivo(models.Model):
    deporte = models.CharField(max_length=50)
    equipo_local = models.CharField(max_length=100)
    equipo_visitante = models.CharField(max_length=100)
    resultado = models.CharField(max_length=20)
    en_vivo = models.BooleanField(default=False)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resultados_deportivos'
        unique_together = ['deporte', 'equipo_local', 'equipo_visitante']

    def __str__(self):
        return f"{self.equipo_local} vs {self.equipo_visitante} - {self.resultado}"
