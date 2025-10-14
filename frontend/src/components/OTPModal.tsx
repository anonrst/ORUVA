import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface OTPModalProps {
  isOpen: boolean;
  onSubmit: (otp: string) => void;
  onCancel: () => void;
  title: string;
  description: string;
  error?: string;
}

export function OTPModal({ isOpen, onSubmit, onCancel, title, description, error }: OTPModalProps) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) {
      onSubmit(otp.trim());
      setOtp('');
    }
  };

  const handleCancel = () => {
    setOtp('');
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
        
        <Input
          type="text"
          placeholder="Enter verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          error={error}
          autoFocus
          className="text-center text-lg tracking-widest"
        />
        
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!otp.trim()}
            className="flex-1"
          >
            Verify
          </Button>
        </div>
      </form>
    </Modal>
  );
}