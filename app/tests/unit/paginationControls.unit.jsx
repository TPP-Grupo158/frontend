import { expect, describe, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PaginationControls from "../../src/components/PaginationControls";

describe("PaginationControls", () => {
  it("shows currentPageNumber", () => {
    const { getByTestId } = render(
      <PaginationControls
        handleNext={vi.fn()}
        handlePrevious={vi.fn()}
        hasMorePages
        currentPageNumber={3}
      />
    );

    expect(getByTestId("patient-pagination-page-num")).toHaveTextContent("3");
  });

  it("can go to previous page", async () => {
    const handlePrevious = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={vi.fn()}
        handlePrevious={handlePrevious}
        hasMorePages
        currentPageNumber={3}
      />
    );

    const prevButton = getByRole("button", { name: "<" });
    await user.click(prevButton);

    expect(handlePrevious).toHaveBeenCalledWith(2);
  });

  it("can go to previous page multiple times", async () => {
    const handlePrevious = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={vi.fn()}
        handlePrevious={handlePrevious}
        hasMorePages
        currentPageNumber={3}
      />
    );

    const prevButton = getByRole("button", { name: "<" });
    
    await user.click(prevButton);
    await user.click(prevButton);
    await user.click(prevButton);

    expect(handlePrevious).toHaveBeenCalledTimes(3)
  });

  it("can not go to previous page if its the first page", async () => {
    const handlePrevious = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={vi.fn()}
        handlePrevious={handlePrevious}
        hasMorePages
        currentPageNumber={1}
      />
    );

    const prevButton = getByRole("button", { name: "<" });
    expect(prevButton).toBeDisabled();

    await user.click(prevButton);
    expect(handlePrevious).not.toHaveBeenCalled();
  });

  it("can go to next page", async () => {
    const handleNext = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={handleNext}
        handlePrevious={vi.fn()}
        hasMorePages
        currentPageNumber={2}
      />
    );

    const nextButton = getByRole("button", { name: ">" });
    await user.click(nextButton);

    expect(handleNext).toHaveBeenCalledWith(3);
  });

  it("can go to next page multiple times", async () => {
    const handleNext = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={handleNext}
        handlePrevious={vi.fn()}
        hasMorePages
        currentPageNumber={2}
      />
    );

    const nextButton = getByRole("button", { name: ">" });

    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    expect(handleNext).toHaveBeenCalledTimes(3);
  });

  it("can not go to next page if there are no more pages", async () => {
    const handleNext = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(
      <PaginationControls
        handleNext={handleNext}
        handlePrevious={vi.fn()}
        hasMorePages={false}
        currentPageNumber={2}
      />
    );

    const nextButton = getByRole("button", { name: ">" });
    expect(nextButton).toBeDisabled();

    await user.click(nextButton);
    expect(handleNext).not.toHaveBeenCalled();
  });
});