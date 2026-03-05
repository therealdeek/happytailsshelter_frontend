import AnimalProfile from "@/components/AnimalProfile";
import AnimalListingComponent from "@/components/animal-listing/animalListingComponent";
import { GlobalContext } from "@/hooks/GlobalContext";
import { useAnimalStore } from "@/store/animals/animalStore";
import { useFosterHistoryStore } from "@/store/fosterhistory/fosterHistoryStore";
import type { Animal } from "@/types/types";
import { useContext, useEffect, type FC, type Key } from "react";
import { useNavigate } from "react-router-dom";

interface MyAnimalsPageProps {}

const MyAnimalsPage: FC<MyAnimalsPageProps> = () => {
  const { fetchAnimals } = useAnimalStore();
  const { fosterHistory, fetchUserFosterHistory } = useFosterHistoryStore();
  const { user, isLoading } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimals();
    if (user) {
      fetchUserFosterHistory(user.user_id);
    }
  }, [user]);

  const handleAnimalClick = (animalId?: number) => {
    if (animalId) {
      navigate(`/fosterparent/animals/${animalId}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl text-center font-bold">My Animals</h1>

      {fosterHistory.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          You currently have no animals assigned to you.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fosterHistory.map((fosterHistoryLog) => {
            return (
              <div
                key={fosterHistoryLog.animal.animal_id}
                onClick={() =>
                  handleAnimalClick(fosterHistoryLog.animal?.animal_id)
                }
                className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <AnimalProfile animal={fosterHistoryLog.animal} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAnimalsPage;
