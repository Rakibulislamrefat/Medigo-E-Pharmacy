import { useEffect, useMemo, useState } from "react";

export type HeroSlide = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
};

export function HeroSlider(props: { slides: HeroSlide[] }) {
  const slides = props.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const safeIndex = useMemo(() => {
    if (slides.length === 0) return 0;
    return ((index % slides.length) + slides.length) % slides.length;
  }, [index, slides.length]);

  useEffect(() => {
    if (paused) return;
    if (slides.length <= 1) return;
    const t = window.setInterval(() => setIndex((v) => v + 1), 5000);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[safeIndex]!;

  return (
    <div className="heroSlider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <img src={current.imageSrc} alt={current.imageAlt} className="heroSliderImg" />

      <div className="heroSliderOverlay">
        <div className="heroSliderKicker">{current.subtitle}</div>
        <div className="heroSliderTitle">{current.title}</div>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            className="heroSliderBtn heroSliderBtnLeft"
            aria-label="Previous slide"
            onClick={() => setIndex((v) => v - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="heroSliderBtn heroSliderBtnRight"
            aria-label="Next slide"
            onClick={() => setIndex((v) => v + 1)}
          >
            ›
          </button>

          <div className="heroSliderDots" role="tablist" aria-label="Slider">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={["heroSliderDot", i === safeIndex ? "heroSliderDotActive" : ""].filter(Boolean).join(" ")}
                aria-label={`Slide ${i + 1}`}
                aria-pressed={i === safeIndex}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

