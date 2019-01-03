//! The FPS counter node draws an FPS counter, using a `TextNode`

use failure::{bail, Error};
use glium::backend::Facade;
use std::{collections::HashMap, rc::Rc, sync::mpsc::Receiver};

use super::{Node, NodeInputs, NodeOutput, TextNode};
use crate::{
    config::nodes::{FpsConfig, NodeParameter, TextConfig},
    event::RendererEvent,
    util::FpsCounter,
};

/// A node that draws text
pub struct FpsNode {
    text_node: TextNode,
    fps_counter: FpsCounter,
    position: [f32; 2],
    color: [f32; 4],
}

impl FpsNode {
    /// Create a new instance
    pub fn new(
        facade: &Rc<dyn Facade>,
        config: FpsConfig,
        receiver: Receiver<RendererEvent>,
    ) -> Result<Self, Error> {
        Ok(Self {
            text_node: TextNode::new(
                facade,
                TextConfig {
                    text: NodeParameter::Static("".to_string()),
                    position: config.position.clone(),
                    color: config.color.clone(),
                    font_name: config.font_name,
                    font_size: config.font_size,
                },
                receiver,
            )?,
            fps_counter: FpsCounter::new(config.interval),
            position: config.position.or_default(),
            color: config.color.or_default(),
        })
    }
}

impl Node for FpsNode {
    fn render(&mut self, inputs: &NodeInputs) -> Result<HashMap<String, NodeOutput>, Error> {
        if let NodeInputs::Fps { position, color } = *inputs {
            self.fps_counter.next_frame();

            let inputs = NodeInputs::Text {
                text: Some(format!("FPS: {:.01}", self.fps_counter.fps())),
                position: Some(position.unwrap_or(self.position)),
                color: Some(color.unwrap_or(self.color)),
            };

            self.text_node.render(&inputs)
        } else {
            bail!("Wrong input type for node");
        }
    }
}
