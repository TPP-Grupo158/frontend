import { expect, describe, it} from "vitest";
import { render, screen } from '@testing-library/react';

import SegmentationStatsDisplay from "@components/Niivue/SegmentationStatsDisplay";

describe('SegmentationStatsDisplay component', () => {
  const getValueForTerm = (label) => {
    const term = screen.getByText(label);
    const dt = term.closest('dt');
    return dt?.nextElementSibling;
  };

  it('renders segmentation stats when they are provided', () => {
    const stats = {
      volumeML: 123.45,
      volumeMM3: 123456.78,
      intensityMax: 255,
      intensityMin: 0,
      intensityMean: 128,
      intensityStdev: 64
    };

    render(<SegmentationStatsDisplay stats={stats} />);

    expect(getValueForTerm('Volume (mL)')).toHaveTextContent('123.45');
    expect(getValueForTerm('Volume (mm³)')).toHaveTextContent('123456.78');
    expect(getValueForTerm('Intensity (max)')).toHaveTextContent('255');
    expect(getValueForTerm('Intensity (min)')).toHaveTextContent('0');
    expect(getValueForTerm('Intensity (mean)')).toHaveTextContent('128');
    expect(getValueForTerm('Intensity (stdev)')).toHaveTextContent('64');
  });

  it('renders nothing when stats are not provided', () => {
    const { container } = render(<SegmentationStatsDisplay stats={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it ('summary is visible and has correct text', () => {
    const stats = {
      volumeML: 123.45,
      volumeMM3: 123456.78,
      intensityMax: 255,
      intensityMin: 0,
      intensityMean: 128,
      intensityStdev: 64
    };

    render(<SegmentationStatsDisplay stats={stats} />);
    const summary = screen.getByText('Segmentation Stats');
    expect(summary).toBeInTheDocument();
    expect(summary.tagName).toBe('SUMMARY');
  });

  it('colapses details when summary is clicked', () => {
    const stats = {
      volumeML: 123.45,
      volumeMM3: 123456.78,
      intensityMax: 255,
      intensityMin: 0,
      intensityMean: 128,
      intensityStdev: 64
    };

    render(<SegmentationStatsDisplay stats={stats} />);
    const details = screen.getByRole('group'); // <details> element
    const summary = screen.getByText('Segmentation Stats'); // <summary> element

    summary.click();
    expect(details).not.toHaveAttribute('open');
  });
  
});