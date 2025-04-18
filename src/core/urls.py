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

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('HistoriaLaboral/', views.HistoriaLaboral, name='HistoriaLaboral'),
    path('console/', views.console_view, name='console'),
    path('execute-script/', views.execute_script, name='execute_script'),
    path('politica-privacidad/', views.politica_privacidad, name='politica_privacidad')
]