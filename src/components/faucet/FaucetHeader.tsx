
interface FaucetHeaderProps {
  title: string;
  description: string;
}

const FaucetHeader = ({ title, description }: FaucetHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default FaucetHeader;
