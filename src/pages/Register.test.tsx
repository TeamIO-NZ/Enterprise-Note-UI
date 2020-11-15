import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderWithRouter from '../setupTests';
import Register from './Register'

afterEach(cleanup);

test("Register page should load", async () => {
    renderWithRouter(<Register />);

    const registerInst = await screen.findAllByText("Register");

    expect(registerInst[0]).toBeInTheDocument();
});