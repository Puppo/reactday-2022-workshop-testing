import { render, screen } from "@testing-library/react";
import { Repository } from "../../services/github.service";
import * as useRepositoriesModule from "./hooks/repositories.hooks";
import Repositories from "./Repositories";


const repositoriesMock: Repository[] = [{
  name: 'test-name',
  description: 'test-description'
}, {
  name: 'test-name-2',
  description: 'test-description-2'
}];


describe('Repositories', () => {

  const mockUseRepositories = (data: ReturnType<typeof useRepositoriesModule['useRepositories']>) => {
    return jest.spyOn(useRepositoriesModule, 'useRepositories').mockReturnValueOnce(data);
  }

  it('should render the component', async () => {
    const spyUseRepositories = mockUseRepositories({ loading: false, error: undefined, repositories: repositoriesMock });

    const { container } = render(<Repositories />);
    expect(container).toMatchSnapshot();
    expect(spyUseRepositories).toHaveBeenCalled();
  });

  it('should render the error', async () => {
    mockUseRepositories({ loading: false, error: 'Error', repositories: [] });

    render(<Repositories />);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it('should render loader', async () => {
    mockUseRepositories({ loading: true, error: undefined, repositories: [] });

    render(<Repositories />);

    const loader = screen.queryByTitle(/content loading/i)
    expect(loader).toBeInTheDocument();
  });
})


export { };
