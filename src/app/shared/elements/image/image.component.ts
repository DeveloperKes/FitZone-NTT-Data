import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IMAGES } from '../../../core/constants';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'fz-image',
  imports: [NgOptimizedImage],
  template: `
  <img priority="priority" [width]="width" [height]="height" [ngSrc]="imgData.src" [alt]="imgData.alt" [title]="imgData.title" [class]="class" (error)="onError()" decoding="async"/>
  `,
  encapsulation: ViewEncapsulation.Emulated,
  styles: [`
    :host{
      --border: none;
      --border-radius: 0;
      --box-shadow: none;
      --object-fit: cover;
      --object-position: center;
    }
    img {
      display: inline-block;
      height: auto;
      object-fit: var(--object-fit, cover);
      object-position: var(--object-position, center);
      border: var(--border, none);
      border-radius: var(--border-radius, 0);
      box-shadow: var(--box-shadow, none);
    }`]
})
export class ImageComponent {
  @Input() key!: keyof typeof IMAGES;
  @Input() class: string = '';
  @Input() width: number = 100;
  @Input() height: number = 100;

  imgData = IMAGES[this.key];

  ngOnChanges(): void {
    this.imgData = IMAGES[this.key];
  }

  onError() {
    this.imgData = IMAGES['FALLBACK'];
  }
}
