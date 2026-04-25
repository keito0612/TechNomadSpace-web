<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\UserReview;
use DevKandil\NotiFire\Channels\FcmChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use DevKandil\NotiFire\Enums\MessagePriority;
use DevKandil\NotiFire\FcmMessage;
class ReviewLikeNotification extends Notification
{
    use Queueable;
    private $user;
    private $review;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user , UserReview $review)
    {
        $this->user = $user;
        $this->review = $review;
    }

    public function via(object $notifiable)
    {
        return [FcmChannel::class];
    }

    public function toFcm(object $notifiable): FcmMessage
    {
        $title = '投稿にいいねされました';
        $body = "{$this->user->name}さんがあなたが投稿した{$this->review->location->name}のレビューにいいねしました";
        $data = [
            'type' => 'review_like',
            'review_id' => (string) $this->review->id,
            'liker_id' => (string) $this->user->id,
            'timestamp' => now()->toIso8601String(),
        ];
        return FcmMessage::create($title, $body)
            ->image('https://example.com/image.jpg')
            ->sound('default')
            ->clickAction('OPEN_ACTIVITY')
            ->icon('notification_icon')
            ->color('#0049B7')
            ->priority(MessagePriority::NORMAL)
            ->data($data);
    }
}
