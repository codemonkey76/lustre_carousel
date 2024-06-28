import lustre
import lustre/attribute
import lustre/element.{text}
import lustre/element/html.{div}

pub fn main() {
  let app = lustre.simple(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)

  Nil
}

fn init(_flags) {
  0
}

type Msg {
  Incr
  Decr
}

fn update(model, msg) {
  case msg {
    Incr -> model + 1
    Decr -> model - 1
  }
}

fn view(_model) {
  div(
    [
      attribute.class("h-[500px] bg-cover grid grid-cols-12 py-24"),
      attribute.style([#("background-image", "url(images/pbx.jpg)")]),
      attribute.class("bg-white p-10"),
    ],
    [
      html.h1(
        [
          attribute.class(
            "col-start-2 col-span-6 text-[#80699d] text-6xl text-shadow-black font-bold uppercase",
          ),
          attribute.style([#("text-shadow", "0 1px 2px rgba(0,0,0,.6)")]),
        ],
        [text("Hosted PBX")],
      ),
      html.h4([], []),
      html.div([], []),
      html.div([], []),
      html.div([], []),
    ],
  )
}
