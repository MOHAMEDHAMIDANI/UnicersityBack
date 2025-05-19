import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { CreateBulkNotificationDto } from "./dto/create-bulk-notification.dto";
import { toNumberOrStringId } from "../utils/id-conversion.util";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<Notification> {
    // Convert any string userId to number if possible
    const userId =
      typeof createNotificationDto.userId === "string"
        ? toNumberOrStringId(createNotificationDto.userId)
        : createNotificationDto.userId;

    // Create the notification with the processed userId
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      userId: userId as any,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAllForUser(userId: string): Promise<Notification[]> {
    const entityId = toNumberOrStringId(userId);

    return this.notificationRepository.find({
      where: { userId: entityId as any },
      order: { createdAt: "DESC" },
    });
  }

  // Alias for findAllForUser to match controller expectations
  async findAll(userId: string): Promise<Notification[]> {
    return this.findAllForUser(userId);
  }

  async findOne(id: string): Promise<Notification> {
    return await this.notificationRepository.findOneBy({ id });
  }
  /**
   * Find notifications created by a specific teacher
   */
  async findByTeacherId(teacherId: string): Promise<Notification[]> {
    const entityId = toNumberOrStringId(teacherId);

    // Using raw query to search in JSON metadata for senderId
    const queryBuilder =
      this.notificationRepository.createQueryBuilder("notification");
    queryBuilder
      .where(`notification.metadata->>'senderId' = :teacherId`, {
        teacherId: entityId.toString(),
      })
      .orderBy("notification.createdAt", "DESC");

    return queryBuilder.getMany();
  }

  async markAsRead(id: string): Promise<Notification> {
    await this.notificationRepository.update(id, { isRead: true });
    return this.findOne(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const entityId = toNumberOrStringId(userId);

    await this.notificationRepository.update(
      { userId: entityId as any, isRead: false },
      { isRead: true }
    );
  }

  // Alias for countUnreadForUser to match controller expectations
  async findUnreadCount(userId: string): Promise<number> {
    return this.countUnreadForUser(userId);
  }

  async countUnreadForUser(userId: string): Promise<number> {
    const entityId = toNumberOrStringId(userId);

    return this.notificationRepository.count({
      where: { userId: entityId as any, isRead: false },
    });
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async removeAllRead(userId: string): Promise<void> {
    const entityId = toNumberOrStringId(userId);

    await this.notificationRepository.delete({
      userId: entityId as any,
      isRead: true,
    });
  }
  async cleanupOldNotifications(
    userId: string,
    olderThan: Date
  ): Promise<void> {
    const entityId = toNumberOrStringId(userId);

    await this.notificationRepository.delete({
      userId: entityId as any,
      isRead: true,
      createdAt: { $lt: olderThan } as any,
    });
  }

  /**
   * Create notifications for multiple users at once
   */
  async createBulkNotifications(
    bulkDto: CreateBulkNotificationDto
  ): Promise<Notification[]> {
    // Process all userIds to ensure they're in the correct format
    const processedUserIds = bulkDto.userIds.map((userId) =>
      typeof userId === "string" ? toNumberOrStringId(userId) : userId
    );

    // Create notification entities
    const notifications = processedUserIds.map((userId) =>
      this.notificationRepository.create({
        title: bulkDto.title,
        content: bulkDto.content,
        type: bulkDto.type,
        userId: userId as any,
        actionLink: bulkDto.actionLink,
        actionLabel: bulkDto.actionLabel,
        metadata: {
          senderName: bulkDto.senderName,
          senderId: bulkDto.senderId || null, // Store the sender ID in metadata
          importance: bulkDto.importance || "normal",
          groupId: Date.now().toString(), // Group notifications by creation batch
        },
      })
    );

    // Save all notifications in one batch
    return await this.notificationRepository.save(notifications);
  }
}
