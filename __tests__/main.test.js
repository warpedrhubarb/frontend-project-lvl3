import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import testingLibraryUserEvent from '@testing-library/user-event';
import fs from "fs";

import runApp from '../src/core/controller.js';

const userEvent = testingLibraryUserEvent;
const elements = {};

beforeEach(async () => {
  const pathToHtml = 'index.html';
  const html = fs.readFileSync(pathToHtml, 'utf8');
  document.body.innerHTML = html;

  elements.input = screen.getByLabelText('url');
  elements.submit = screen.getByLabelText('add');

  await runApp();
});

test('Validation: URL', async () => {
  userEvent.type(elements.input, 'asdfg');
  userEvent.click(elements.submit);
  const feedback = document.getElementById('feedback');

  // console.log(feedback.textContent);
  expect(feedback.textContent).toEqual('loading');
});
