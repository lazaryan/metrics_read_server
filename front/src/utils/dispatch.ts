import { createEventDispatcher } from 'svelte'
import { get_current_component } from 'svelte/internal'

const createDispatch = () => {
  const svelteDispatch = createEventDispatcher();
  const component = get_current_component();

  const dispatch = <T>(name: string, detail: T) => {
    svelteDispatch(name, detail);
    component.dispatchEvent &&
      component.dispatchEvent(new CustomEvent(name, { detail }));
  };

  return dispatch;
}

export default createDispatch;
