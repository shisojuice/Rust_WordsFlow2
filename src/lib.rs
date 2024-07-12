use std::io::{ Cursor};
use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageFormat, Rgba};
use rusttype::{Scale, point};
use base64::{engine::general_purpose, Engine as _};

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn str_to_png(str:&str,font_data:&[u8]) -> String{
    let ch = str.chars().nth(0);
    let font = rusttype::Font::try_from_vec(Vec::from(font_data)).unwrap();
    let scale = Scale::uniform(256.0);
    let v_metrics = font.v_metrics(scale);
    let glyphs: Vec<_> = font
        .layout(&*ch.unwrap().to_string(), scale, point(65.0, 15.0 + v_metrics.ascent ))
        .collect();
    let glyphs_height = (v_metrics.ascent - v_metrics.descent).ceil() as u32;
    let mut image = DynamicImage::new_rgba8(glyphs_height + 64, glyphs_height + 64).to_rgba8();
    for glyph in glyphs {
        if let Some(bounding_box) = glyph.pixel_bounding_box() {
            let pad = 220 - bounding_box.max.x;
            glyph.draw(|x, y, v| {
                image.put_pixel(
                    x + bounding_box.min.x as u32 + pad as u32,
                    y + bounding_box.min.y as u32,
                    Rgba([0, 0, 0, (v * 255.0) as u8]),
                )
            });
        }
    }
    let mut buffer = Cursor::new(Vec::new());
    image.write_to(&mut buffer, ImageFormat::Png).unwrap();
    let base64_string = general_purpose::STANDARD.encode(buffer.get_ref());
    // データURL形式で返す
    format!("data:image/png;base64,{}", base64_string)
}
