import * as ECS from 'miaam-ecs';
import * as PIXI from 'pixi.js';
import * as Types from './src/types/index.js';
import * as Components from './src/components/index.js';
import * as Entities from './src/entities/index.js';
import * as Systems from './src/systems/index.js';

import { AssetsManager, GameManager, SceneManager } from './src/manager/index.js';

export { GameManager, AssetsManager, SceneManager, ECS, PIXI, Types, Components, Entities, Systems };
