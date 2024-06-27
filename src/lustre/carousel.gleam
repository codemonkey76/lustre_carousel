import gleam/list.{filter}
import lustre/carousel/slide.{type Slide}

/// A singleton holding all your carousels
pub opaque type Carousels {
  Carousels(carousels: List(Carousel))
}

/// Create an empty list of carousels
pub fn new() -> Carousels {
  Carousels([])
}

type Carousel {
  Carousel(
    /// The id of the carousel, this must be unique
    id: String,
    /// Show clickable icons to display which slide we are up to, and navigate to specific slide
    show_progress: Bool,
    /// Show the left and right navigation icons
    show_nav: Bool,
    /// The slides contained within this carousel
    slides: List(Slide),
  )
}

pub fn add(
  carousels: Carousels,
  id: String,
  slides: List(Slide),
  show_progress: Bool,
  show_nav: Bool,
) -> Carousels {
  use list <- change_list(carousels)
  [Carousel(id, show_progress, show_nav, slides), ..list]
}

pub fn remove(carousels: Carousels, id: String) -> Carousels {
  use list <- change_list(carousels)
  filter(list, fn(c) { c.id != id })
}

fn change_list(
  carousels: Carousels,
  f: fn(List(Carousel)) -> List(Carousel),
) -> Carousels {
  Carousels(f(carousels.carousels))
}

pub fn count(carousels c: Carousels) -> Int {
  list.length(c.carousels)
}
