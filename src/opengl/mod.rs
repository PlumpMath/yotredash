//! Contains everything for the OpenGL renderer pipeline

pub mod nodes;
pub mod renderer;
pub mod text;

use glium::uniforms::{AsUniformValue, UniformValue, Uniforms};
use std::{borrow::Cow, rc::Rc};

/// A `UniformsStorage` which has a `push` method for appending new uniforms
#[derive(Clone, Default)]
pub struct UniformsStorageVec<'name, 'uniform>(
    Vec<(Cow<'name, str>, Rc<dyn AsUniformValue + 'uniform>)>,
);

impl<'name, 'uniform> UniformsStorageVec<'name, 'uniform> {
    /// Create a new instance
    pub fn new() -> Self {
        Default::default()
    }

    /// Push a new uniform onto the array
    pub fn push<S, U>(&mut self, name: S, uniform: U)
    where
        S: Into<Cow<'name, str>>,
        U: AsUniformValue + 'uniform,
    {
        self.0.push((name.into(), Rc::new(uniform)))
    }
}

impl<'name, 'uniform> Uniforms for UniformsStorageVec<'name, 'uniform> {
    #[cfg_attr(feature = "cargo-clippy", allow(needless_lifetimes))]
    #[inline]
    fn visit_values<'a, F: FnMut(&str, UniformValue<'a>)>(&'a self, mut output: F) {
        for &(ref name, ref uniform) in &self.0 {
            output(name, uniform.as_uniform_value());
        }
    }
}
