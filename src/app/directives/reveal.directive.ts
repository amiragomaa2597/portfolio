import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly delay = input(0, { alias: 'appRevealDelay' });

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    if (this.delay()) {
      node.style.setProperty('--reveal-delay', `${this.delay()}ms`);
    }

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
  }
}
