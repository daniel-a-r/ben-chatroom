import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/components/ui/emoji-picker';
import type { Emoji } from 'frimousse';
import type { Dispatch, SetStateAction } from 'react';

interface EmojiPickerProps {
  setInputValue: Dispatch<SetStateAction<string>>;
  isSuccess: boolean;
}

const EmojiPickerComponent = ({
  setInputValue,
  isSuccess,
}: EmojiPickerProps) => {
  const handleEmojiSelect = ({ emoji }: Emoji) => {
    if (isSuccess) {
      setInputValue((prev) => prev + emoji);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='text-lg' variant='secondary'>
          Emoji Picker
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-fit p-0'>
        <EmojiPicker className='h-[22rem]' onEmojiSelect={handleEmojiSelect}>
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerComponent;
