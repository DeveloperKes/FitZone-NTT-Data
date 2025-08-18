import { Component, computed, signal, WritableSignal } from '@angular/core';
import { Category, Course, CourseLevel, DayOfWeek, Headquarters, ScheduleShift } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { AlertService, CourseService, FilterPill } from '../../../core/services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'fz-filter-box',
  imports: [ReactiveFormsModule],
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.scss'
})
export class FilterBoxComponent {
  headquarters: Headquarters[] = [];
  categories: Category[] = [];
  daysWeek: { id: DayOfWeek, label: string }[] = [
    { id: "monday", label: "Lunes" },
    { id: "tuesday", label: "Martes" },
    { id: "wednesday", label: "Miércoles" },
    { id: "thursday", label: "Jueves" },
    { id: "friday", label: "Viernes" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
  ];
  shifts: { id: ScheduleShift, label: string }[] = [
    { id: "morning", label: "Mañana" },
    { id: "afternoon", label: "Tarde" },
    { id: "evening", label: "Noche" },
  ]
  levels: { id: CourseLevel, label: string }[] = [
    { id: "beginner", label: "Principiante" },
    { id: "intermediate", label: "Intermedio" },
    { id: "advanced", label: "Avanzado" },
  ]

  form: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    public readonly _course: CourseService,
    private readonly _fb: FormBuilder,
    private readonly _alert: AlertService
  ) {
    this.form = _fb.group({
      headquarters: ['all'],
      categories: ['all'],
      days: ['all'],
      shift: ['all'],
      levels: ['all'],
    })
  }

  ngOnInit() {
    this.route.data.subscribe(requests => {
      this.headquarters = requests['headquarters'].data || [];
      this.categories = requests['categories'].data || [];
    });
    this.showPills();
  }


  validateAndAggregate<T>(
    value: any,
    items: T[],
    filtersSignal: WritableSignal<FilterPill[]>,
    getKey: (item: T) => string,
    getValue: (item: T) => string
  ) {
    const data = items.find(v => getKey(v) === value);
    if (data) {
      const key = getKey(data);
      const value = getValue(data);
      const found = filtersSignal().find(v => v.key === key);
      if (!found) {
        filtersSignal.update(pills => [...pills, { key, value }]);
      }
    }
  }

  showPills() {
    this.form.controls['categories'].valueChanges.subscribe({
      next: (value) => {
        if (value != "all") this.validateAndAggregate(value, this.categories, this._course.categoriesFilters, item => `${item.id}`, item => item.name)
        else this._course.categoriesFilters.set([]);
      }
    })
    this.form.controls['days'].valueChanges.subscribe({
      next: (value) => {
        if (value != "all") this.validateAndAggregate(value, this.daysWeek, this._course.daysFilters, item => `${item.id}`, item => item.label)
        else this._course.daysFilters.set([]);
      }
    })
    this.form.controls['headquarters'].valueChanges.subscribe({
      next: (value) => {
        if (value != "all") this.validateAndAggregate(value, this.headquarters, this._course.headquartersFilters, item => `${item.id}`, item => item.name)
        else this._course.headquartersFilters.set([]);
      }
    })
    this.form.controls['shift'].valueChanges.subscribe({
      next: (value) => {
        if (value != "all") this.validateAndAggregate(value, this.shifts, this._course.shiftFilters, item => `${item.id}`, item => item.label);
        else this._course.shiftFilters.set([]);
      }
    })
    this.form.controls['levels'].valueChanges.subscribe({
      next: (value) => {
        if (value != "all") this.validateAndAggregate(value, this.levels, this._course.levelFilters, item => `${item.id}`, item => item.label);
        else this._course.levelFilters.set([]);
      }
    })
  }

  deletePill(key: string, filterSignal: WritableSignal<FilterPill[]>) {
    filterSignal.update(pills => pills.filter(p => p.key != key))
  }
}
