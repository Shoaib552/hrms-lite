from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AttendanceViewSet

router = DefaultRouter()
router.register('employees', EmployeeViewSet)
router.register('attendance', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
