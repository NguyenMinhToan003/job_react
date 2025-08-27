import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Language, LanguageJob } from "@/types/languageType";

export default function LanguageJobPopup({
  languageList,
  languageIds,
  setLanguageIds,
  notEdit,
}: {
  languageList: Language[];
  languageIds: LanguageJob[];
  setLanguageIds: (id: LanguageJob[]) => void;
  notEdit?: boolean;
}) {
  const handleCheckboxChange = (language: Language, checked: boolean) => {
    if (notEdit) return;
    if (checked) {
      setLanguageIds([...languageIds, { languageId: Number(language.id), level: 1 }]);
    } else {
      setLanguageIds(
        languageIds.filter((item) => item.languageId !== Number(language.id))
      );
    }
  };

  return (
    <Card className="rounded-sm border-none shadow-md mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-start">
          <div className="flex items-center gap-2">
            <div className="flex-1">YÊU CẦU NGÔN NGỮ</div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {languageList.map((language) => {
            const isChecked = languageIds.some((item) =>
              item.languageId === Number(language.id))
            return (
              <div key={language.id} className="flex items-center gap-2">
                <Checkbox
                  id={`language-${language.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(language, Boolean(checked))
                  }
                />
                <Label htmlFor={`language-${language.id}`} className="cursor-pointer">
                  <div>{language.name}</div>
                </Label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
