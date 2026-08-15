import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AutocompleteInput from "@/components/v2/AutocompleteInput";

/** Controlled wrapper that mirrors the parent state, like the wizard does. */
function Wrapper({ options, onChange }: { options: string[]; onChange?: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <AutocompleteInput
      value={value}
      options={options}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
    />
  );
}

describe("AutocompleteInput", () => {
  it("renders the current value and placeholder", () => {
    render(
      <AutocompleteInput
        value="Audi"
        options={["Audi", "BMW"]}
        placeholder="Marque"
        onChange={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText("Marque")).toHaveValue("Audi");
  });

  it("filters suggestions as the user types and selects on click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Wrapper options={["Audi", "BMW", "Mercedes"]} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.type(input, "au");

    // Only "Audi" matches "au"
    const option = await screen.findByText("Audi");
    expect(screen.queryByText("BMW")).not.toBeInTheDocument();
    expect(screen.queryByText("Mercedes")).not.toBeInTheDocument();

    await user.click(option);
    expect(onChange).toHaveBeenCalledWith("Audi");
  });

  it("shows an empty-state message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Wrapper options={["Audi"]} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.type(input, "zzz");

    expect(await screen.findByText(/Aucune suggestion/)).toBeInTheDocument();
    expect(screen.getByText(/لا توجد اقتراحات/)).toBeInTheDocument();
  });
});
