import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IMAGES } from '../../../core/constants';
import { NgOptimizedImage } from '@angular/common';
/**
 * Image Component
 * 
 * Description...
 * 
 * CSS properties
 * 
 * --border
 * 
 * --border-radius
 * 
 * --box-shadow
 * 
 * --object-fit
 * 
 * --object-position
 */
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
      --host-height: auto;
      height: var(--host-height, auto) !important;
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
  @Input() path: string = '';
  @Input() alt?: string;
  @Input() title?: string;

  imgData = this.buildImageData();

  ngOnChanges(): void {
    this.imgData = this.buildImageData();
  }

  onError() {
    this.imgData = IMAGES['FALLBACK'];
  }

  private buildImageData() {
    if (!this.path && !this.key) return IMAGES["FALLBACK"];
    if (!this.path) return IMAGES[this.key];
    if (this.path && !this.alt) {
      console.error("alt property is required");
      return IMAGES["FALLBACK"];
    }
    return {
      src: this.path,
      alt: this.alt ?? "Image",
      title: this.title ?? "FitZone Image"
    }
  }
}
