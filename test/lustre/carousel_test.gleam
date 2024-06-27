import gleam/io
import gleeunit/should
import lustre/carousel
import lustre/carousel/slide

pub fn create_carousels_test() {
  carousel.new()
  |> carousel.count
  |> should.equal(0)
}

pub fn add_carousel_test() {
  carousel.new()
  |> carousel.add("foo", [], False, False)
  |> carousel.count
  |> should.equal(1)
}

pub fn add_slide_test() {
  let carousels = carousel.new()

  [
    slide.new_static("./priv/static/some_image.png"),
    slide.new_static("./priv/static/some_image2.png"),
  ]
  |> carousel.add(carousels, "foo", _, False, False)
  |> io.debug
  |> carousel.count
  |> should.equal(1)
}
// scroll slide
// each component should have animation and animation-delay
// add elements like this:
// <h1 class="animated bounceInLeft animation-duration-1s animation-delay-1s">HOSTED PBX</h1>
// <h4 class="animated bounceInLeft animation-duration-1s animation-delay-2s">Cloud-based communicatoin system without the chunky equipment.</h4>
// <div class="flex animated fadeIn animation-duration-1s animation-delay-3s"><span>icon</span><span>text</span>
