import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import * as MenuBar from "@radix-ui/react-menubar";
import MenubarMenu from "@components/Niivue/radix-ui/MenubarMenu.jsx";
import MenubarRadioGroup from "@components/Niivue/radix-ui/MenubarRadioGroup.jsx";

const items = [
  { value: "axial", label: "Axial" },
  { value: "sagittal", label: "Sagittal" },
  { value: "coronal", label: "Coronal" },
];

function Harness({ onChange }) {
  const [value, setValue] = useState("axial");
  const handleChange = (next) => {
    onChange?.(next);
    setValue(next);
  };

  return (
    <MenuBar.Root>
      <MenubarMenu label="View">
        <MenubarRadioGroup
          value={value}
          onValueChange={handleChange}
          items={items}
        />
      </MenubarMenu>
    </MenuBar.Root>
  );
}

test("shows radio items with initial selection", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(screen.getByRole("menuitem", { name: /view/i }));
  const axial = await screen.findByRole("menuitemradio", { name: /axial/i });
  const sagittal = screen.getByRole("menuitemradio", { name: /sagittal/i });

  expect(axial).toHaveAttribute("aria-checked", "true");
  expect(sagittal).toHaveAttribute("aria-checked", "false");
});

test("changes selection on click and reports value", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Harness onChange={onChange} />);

  await user.click(screen.getByRole("menuitem", { name: /view/i }));
  const sagittal = await screen.findByRole("menuitemradio", { name: /sagittal/i });

  await user.click(sagittal);
  expect(onChange).toHaveBeenCalledWith("sagittal");
  expect(sagittal).toHaveAttribute("aria-checked", "true");
});