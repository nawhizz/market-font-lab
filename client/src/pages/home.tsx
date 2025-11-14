import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Type, Palette, Plus, Minus, Bold, Italic, Paintbrush, Save, Heart } from "lucide-react";
import type { InsertMemo } from "@shared/schema";

const PRESET_COLORS = [
  { name: "검정", value: "#2C1810" },
  { name: "진한 갈색", value: "#5D4037" },
  { name: "빨강", value: "#D32F2F" },
  { name: "주황", value: "#F57C00" },
  { name: "노랑", value: "#FBC02D" },
  { name: "초록", value: "#388E3C" },
  { name: "파랑", value: "#1976D2" },
];

const PRESET_BG_COLORS = [
  { name: "크림", value: "#FFF8E1" },
  { name: "복숭아", value: "#FFE0B2" },
  { name: "살구", value: "#FFCCBC" },
  { name: "연한 노랑", value: "#FFFDE7" },
  { name: "연한 주황", value: "#FFF3E0" },
  { name: "하늘", value: "#E3F2FD" },
  { name: "민트", value: "#E0F2F1" },
];

export default function Home() {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState("#2C1810");
  const [bgColor, setBgColor] = useState("#FFF8E1");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  const { toast } = useToast();

  const saveMemo = useMutation({
    mutationFn: async (memo: InsertMemo) => {
      return await apiRequest("POST", "/api/memos", memo);
    },
    onSuccess: () => {
      toast({
        title: "저장되었습니다!",
        description: "메모가 성공적으로 저장되었습니다.",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "저장 실패",
        description: "메모 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "메모 내용이 비어있습니다.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const memo: InsertMemo = {
      content: content.trim(),
      styles: {
        color: fontColor,
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
      },
      bgColor,
    };

    saveMemo.mutate(memo);
  };

  const increaseFontSize = () => {
    if (fontSize < 72) setFontSize(fontSize + 4);
  };

  const decreaseFontSize = () => {
    if (fontSize > 16) setFontSize(fontSize - 4);
  };

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* Compact Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex-shrink-0">
        {/* Decorative Background Pattern - Simplified */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-5 w-20 h-20 bg-primary rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-5 w-24 h-24 bg-orange-500 rounded-full blur-2xl" />
        </div>

        <div className="relative py-6 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 
              className="text-3xl md:text-4xl font-display font-bold text-primary drop-shadow-sm"
              data-testid="text-page-title"
            >
              대조시장체, 지금 써보기
            </h1>
            <p className="text-sm md:text-base text-primary/80 font-medium mt-2">
              대조시장의 따뜻한 감성을 담은 폰트로 나만의 메시지를 만들어보세요
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - iPad Optimized Layout */}
      <main className="flex-1 overflow-hidden px-4 py-4">
        <div className="h-full max-w-7xl mx-auto">
          {/* Two Column Layout for iPad */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 h-full">
            {/* Left Panel - Style Controls */}
            <div className="flex flex-col gap-4 h-full overflow-y-auto">
              <Card className="p-4 shadow-lg flex-shrink-0">
                <div className="space-y-4">
                  {/* Background Color Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-muted-foreground" />
                      <label className="text-xs font-semibold text-card-foreground">
                        배경 색상
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_BG_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setBgColor(color.value)}
                          className={`w-9 h-9 rounded-full transition-all ${
                            bgColor === color.value
                              ? "ring-3 ring-primary ring-offset-1"
                              : "hover-elevate"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                          data-testid={`button-bgcolor-${color.name}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Color Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <label className="text-xs font-semibold text-card-foreground">
                        글자 색상
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setFontColor(color.value)}
                          className={`w-9 h-9 rounded-full transition-all border-2 border-border ${
                            fontColor === color.value
                              ? "ring-3 ring-primary ring-offset-1"
                              : "hover-elevate"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                          data-testid={`button-fontcolor-${color.name}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Controls - Horizontal Layout */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {/* Font Size */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-card-foreground block">
                        크기
                      </label>
                      <div className="flex flex-col items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={increaseFontSize}
                          disabled={fontSize >= 72}
                          className="w-full h-8"
                          data-testid="button-increase-fontsize"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span 
                          className="text-center font-semibold text-sm"
                          data-testid="text-fontsize-value"
                        >
                          {fontSize}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={decreaseFontSize}
                          disabled={fontSize <= 16}
                          className="w-full h-8"
                          data-testid="button-decrease-fontsize"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Bold Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-card-foreground block">
                        굵게
                      </label>
                      <div className="flex justify-center pt-2">
                        <Button
                          variant={isBold ? "default" : "outline"}
                          size="icon"
                          onClick={() => setIsBold(!isBold)}
                          data-testid="button-toggle-bold"
                          className="w-10 h-10"
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Italic Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-card-foreground block">
                        기울임
                      </label>
                      <div className="flex justify-center pt-2">
                        <Button
                          variant={isItalic ? "default" : "outline"}
                          size="icon"
                          onClick={() => setIsItalic(!isItalic)}
                          data-testid="button-toggle-italic"
                          className="w-10 h-10"
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-3">
                    <Button
                      onClick={handleSave}
                      disabled={saveMemo.isPending}
                      className="w-full h-12 text-base rounded-lg shadow-md hover:shadow-lg transition-all"
                      data-testid="button-save-memo"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveMemo.isPending ? "저장 중..." : "저장하기"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Feature Badges - Compact */}
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground px-1">
                <div className="flex items-center gap-1.5">
                  <Paintbrush className="w-3 h-3" />
                  <span>자유로운 꾸미기</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3" />
                  <span>시장의 따뜻함</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Memo Editor */}
            <Card 
              className="shadow-xl transition-colors duration-200 overflow-hidden flex flex-col h-full"
              style={{ backgroundColor: bgColor }}
            >
              <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setContent(e.currentTarget.textContent || "")}
                  data-placeholder="여기에 메시지를 입력해보세요..."
                  className="outline-none h-full font-display leading-relaxed"
                  style={{
                    color: fontColor,
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                  }}
                  data-testid="input-memo-content"
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
