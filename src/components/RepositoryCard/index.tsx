interface Props {
  name: string;
  description: string;
}

export default function RepositoryCard({
  name, description
}: Props) {
  return <div className='card'>
    <div className="card-content">
      <div className="media">
        <div className="media-content">
          <p className="title is-4">{name}</p>
        </div>
      </div>
      <div className="content">
        {description}
      </div>
    </div>
  </div>
}
