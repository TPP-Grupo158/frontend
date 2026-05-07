import { expect, test} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import * as MenuBar from "@radix-ui/react-menubar";
import MenubarMenu from "@components/Niivue/radix-ui/MenubarMenu.jsx";
import MenubarCheckboxItem from "@components/Niivue/radix-ui/MenubarCheckbox.jsx";

function Harness() {
  const [checked, setChecked] = useState(true);
  return (
    <MenuBar.Root>
      <MenubarMenu label="View">
        <MenubarCheckboxItem
          checked={checked}
          onCheckedChange={setChecked}
          label="Show Crosshair"
        />
      </MenubarMenu>
    </MenuBar.Root>
  );
}

test("checkbox toggles on click", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(screen.getByRole("menuitem", { name: /view/i }));
  const checkbox = await screen.findByRole("menuitemcheckbox", { name: /show crosshair/i });

  expect(checkbox).toHaveAttribute("aria-checked", "true");
  await user.click(checkbox);
  expect(checkbox).toHaveAttribute("aria-checked", "false");
});