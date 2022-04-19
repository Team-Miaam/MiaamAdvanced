import * as ECS from 'miaam-ecs';
import * as PIXI from 'pixi.js';
import { Bodies, Composites, SAT as Collision, Body } from 'matter-js';
import * as Types from './src/types/index.js';
import * as Components from './src/components/index.js';
import * as Entities from './src/entities/index.js';
import * as Systems from './src/systems/index.js';
import Keyboard from './src/input/keyboard/keyboard.js';

import { AssetsManager, GameManager, SceneManager, PhysicsManager } from './src/manager/index.js';

export {
	GameManager,
	AssetsManager,
	SceneManager,
	PhysicsManager,
	ECS,
	PIXI,
	Types,
	Components,
	Entities,
	Systems,
	Keyboard,
	Bodies,
	Composites,
	Collision,
	Body,
};
