import Details from "@/components/homepage/details";

type DetailsProps = {
  id: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExerciseDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const ExerciseDetails = Details as React.ComponentType<DetailsProps>;

  return <ExerciseDetails id={id} />;
}