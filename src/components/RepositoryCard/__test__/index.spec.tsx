import { render, screen } from "@testing-library/react";
import RepositoryCard from "..";

describe('RepositoryCard', () => {

  it('should render the component', () => {
    const { container } = render(<RepositoryCard name="test" description="test" />);
    expect(container).toMatchSnapshot();
  });

  it('should render the repository name', () => {
    render(<RepositoryCard name="test-name" description="test-description" />);
    const el = screen.getByText('test-name')
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('P');
  });

  it('should render the repository description', () => {
    render(<RepositoryCard name="test-name" description="test-description" />);
    const el = screen.getByText('test-description')
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('DIV');
  });


})

export { };
