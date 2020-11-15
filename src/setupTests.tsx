import React from 'react'
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'

function renderWithRouter(
  ui: any,
  route: string = '/web/',
  history: any = createMemoryHistory({ initialEntries: [route] })
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  }
}

export default renderWithRouter