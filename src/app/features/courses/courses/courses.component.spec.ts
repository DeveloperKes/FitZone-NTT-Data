import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CoursesComponent } from './courses.component';
import { FormBuilder } from '@angular/forms';
import { AlertService, CourseService } from '../../../core/services';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Course } from '../../../shared/interfaces';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let courseServiceMock = jasmine.createSpyObj('CourseService', [], { list: [] });
  let alertServiceMock = jasmine.createSpyObj('AlertService', ['openAlert']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesComponent],
      providers: [
        FormBuilder,
        { provide: CourseService, useValue: courseServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              courses: {
                data: [
                  {
                    "title": "Zumba Energética",
                    "description": "Disfruta de una clase llena de ritmo latino y movimientos dinámicos que combinan baile y ejercicio cardiovascular. Ideal para quemar calorías mientras te diviertes al máximo.",
                    "duration": 8,
                    "level": "beginner",
                    "instructor": "Laura Torres",
                    "thumbnailUrl": "https://i.postimg.cc/HLFX39TY/test-zumba.jpg",
                    "price": 120000,
                    "id": 1,
                    "category": {
                      "id": 1,
                      "name": "Zumba"
                    },
                    "headquarters": {
                      "id": 1,
                      "name": "FitZone Vital",
                      "address": "Cra. 7 #116-45",
                      "city": "Bogotá",
                      "town": "Usaquén",
                      "phone": "1234567890",
                      "email": ""
                    },
                    "schedule": [
                      {
                        "courseId": 1,
                        "dayOfWeek": "monday",
                        "shift": "morning",
                        "startTime": "07:00",
                        "endTime": "08:00",
                        "id": 1
                      },
                      {
                        "courseId": 1,
                        "dayOfWeek": "wednesday",
                        "shift": "morning",
                        "startTime": "07:00",
                        "endTime": "08:00",
                        "id": 2
                      }
                    ]
                  },
                  {
                    "title": "CrossFit Intensivo",
                    "description": "Un programa desafiante que combina levantamiento olímpico, resistencia y alta intensidad para mejorar fuerza y acondicionamiento físico en tiempo récord.",
                    "duration": 12,
                    "level": "advanced",
                    "instructor": "Carlos Ramírez",
                    "thumbnailUrl": "/images/courses/crossfit.jpg",
                    "price": 180000,
                    "id": 2,
                    "category": {
                      "id": 2,
                      "name": "CrossFit"
                    },
                    "headquarters": {
                      "id": 2,
                      "name": "FitZone Power",
                      "address": "Cra. 10 #45-67",
                      "city": "Bogotá",
                      "town": "Chapinero",
                      "phone": "0987654321",
                      "email": ""
                    },
                    "schedule": [
                      {
                        "courseId": 2,
                        "dayOfWeek": "tuesday",
                        "shift": "evening",
                        "startTime": "18:00",
                        "endTime": "19:30",
                        "id": 3
                      },
                      {
                        "courseId": 2,
                        "dayOfWeek": "thursday",
                        "shift": "evening",
                        "startTime": "18:00",
                        "endTime": "19:30",
                        "id": 4
                      }
                    ]
                  }
                ] as Course[]
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debe inicializar la lista de cursos desde ActivatedRoute', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(courseServiceMock.list.length).toBe(2);
    expect(component.courses[0].title).toBe('Angular Básico');
  }));

  it('debe llamar a AlertService.openAlert cuando se abre el filtro', () => {
    component.openFilters();
    expect(alertServiceMock.openAlert).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: 'modal',
        route: ['filters']
      })
    );
  });

  it('debe filtrar cursos por valor en el input de búsqueda', () => {
    component.form.controls['search'].setValue('Zumba');
    expect(component.courses.length).toBe(1);
    expect(component.courses[0].title).toBe('Zumba Energética');
  });
});
