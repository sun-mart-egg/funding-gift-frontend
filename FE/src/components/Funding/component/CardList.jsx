import Card from "../component/Card";

function CardList({ data, basePath }) {
  return (
    <div className="m-1 my-2 flex flex-wrap justify-start">
      {data.map((item, index) => (
        <Card
          key={index}
          title={item.title}
          productName={item.productName}
          startDate={item.startDate}
          endDate={item.endDate}
          progress={(item.sumPrice / item.targetPrice) * 100}
          img={item.productImage}
          fundingId={item.fundingId}
          basePath={basePath}
        />
      ))}
    </div>
  );
}

export default CardList;
