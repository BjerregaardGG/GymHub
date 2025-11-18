import { mount } from 'svelte'
import 'toastr/build/toastr.min.css';
import './app.css'
// @ts-ignore
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
