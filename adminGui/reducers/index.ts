import {combineReducers} from 'redux'

import {IState} from '../IState'

import {modal} from './modal'
import {langCust} from './langCust'
import { initData } from './initData';

export default combineReducers<IState>({modal, initData, langCust, })
