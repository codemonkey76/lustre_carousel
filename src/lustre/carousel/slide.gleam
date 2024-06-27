pub type Slide {
  StaticSlide(image_url: String)
  AnimatedSlide
}

pub fn new_static(image_url: String) -> Slide {
  StaticSlide(image_url)
}
