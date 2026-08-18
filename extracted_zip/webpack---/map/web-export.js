import mapModule from './index';

window.tt = window.tt ? {...window.tt, ...mapModule} : mapModule;
