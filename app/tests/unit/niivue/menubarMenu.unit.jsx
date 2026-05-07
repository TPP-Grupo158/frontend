import { expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as MenuBar from "@radix-ui/react-menubar";
import MenubarMenu from "@components/Niivue/radix-ui/MenubarMenu.jsx";

function Harness() {
  return (
    <MenuBar.Root>
      <MenubarMenu label="File">
        <MenuBar.Item>Open</MenuBar.Item>
      </MenubarMenu>
      <MenubarMenu label="Edit">
        <MenuBar.Item>Undo</MenuBar.Item>
      </MenubarMenu>
    </MenuBar.Root>
  );
}

test("opens on click", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  expect(screen.queryByRole("menuitem", { name: /open/i })).toBeNull();

  await user.click(screen.getByRole("menuitem", { name: /file/i }));
  expect(await screen.findByRole("menuitem", { name: /open/i })).toBeVisible();
});

test("closes when clicking on the same menu", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  expect(screen.queryByRole("menuitem", { name: /open/i })).toBeNull();

  await user.click(screen.getByRole("menuitem", { name: /file/i }));
  expect(await screen.findByRole("menuitem", { name: /open/i })).toBeVisible();
  await user.click(screen.getByRole("menuitem", { name: /file/i }));
  await waitFor(() => {
    expect(screen.queryByRole("menuitem", { name: /open/i })).toBeNull();
  });
});

test("opens on hover when another menu is already open", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(screen.getByRole("menuitem", { name: /file/i }));
  expect(await screen.findByRole("menuitem", { name: /open/i })).toBeVisible();

  await user.hover(screen.getByRole("menuitem", { name: /edit/i }));
  expect(await screen.findByRole("menuitem", { name: /undo/i })).toBeVisible();
});

test("closes when clicking outside", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(screen.getByRole("menuitem", { name: /file/i }));
  expect(await screen.findByRole("menuitem", { name: /open/i })).toBeVisible();

  await user.click(document.body);

  await waitFor(() => {
    expect(screen.queryByRole("menuitem", { name: /open/i })).toBeNull();
  });
});