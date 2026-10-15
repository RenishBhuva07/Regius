import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Check,
  Briefcase,
  Mic,
  Bell,
  Activity,
  BookOpen,
  Volume2,
} from 'lucide-react-native';
import { Fonts } from '../../../Theme/fonts';

export interface TimelineItem {
  id: string;
  time: string;
  category: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming' | 'spoken_checkin';
  badgeText?: string;
  badgeType?: 'mint' | 'amber' | 'neutral' | 'work' | 'voice_prep' | 'icon';
  iconType?: 'bell' | 'fitness' | 'book' | 'work' | 'voice';
}

interface TimelineItemCardProps {
  item: TimelineItem;
  isFirst?: boolean;
  isLast?: boolean;
  onToggleComplete?: (id: string) => void;
  onExtendMinutes?: (id: string) => void;
  onPressCard?: (item: TimelineItem) => void;
}

export const TimelineItemCard: React.FC<TimelineItemCardProps> = ({
  item,
  isFirst = false,
  isLast = false,
  onToggleComplete,
  onExtendMinutes,
  onPressCard,
}) => {
  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress';
  const isSpoken = item.status === 'spoken_checkin';

  const renderBadge = () => {
    if (item.badgeType === 'work') {
      return (
        <View style={styles.workBadge}>
          <Briefcase size={12} color="#46464A" />
          <Text style={styles.workBadgeText}>Work</Text>
        </View>
      );
    }
    if (item.badgeType === 'voice_prep') {
      return (
        <View style={styles.voicePrepBadge}>
          <Volume2 size={11} color="#4D4727" />
          <Text style={styles.voicePrepBadgeText}>Aria Voice Prep</Text>
        </View>
      );
    }
    if (item.badgeType === 'mint' && item.badgeText) {
      return (
        <View style={styles.mintBadge}>
          <Text style={styles.mintBadgeText}>{item.badgeText}</Text>
        </View>
      );
    }
    if (item.badgeText) {
      return (
        <View style={styles.neutralBadge}>
          <Text style={styles.neutralBadgeText}>{item.badgeText}</Text>
        </View>
      );
    }
    if (item.iconType === 'bell') {
      return <Bell size={16} color="#665F3D" />;
    }
    if (item.iconType === 'fitness') {
      return <Activity size={16} color="#4C6452" />;
    }
    if (item.iconType === 'book') {
      return <BookOpen size={16} color="#665F3D" />;
    }
    return null;
  };

  const renderTimelinePin = () => {
    if (isCompleted) {
      return (
        <View style={[styles.pinCircle, styles.pinCompleted]}>
          <Check size={12} color="#2D5A37" strokeWidth={3} />
        </View>
      );
    }
    if (isInProgress) {
      return (
        <View style={[styles.pinCircle, styles.pinInProgress]}>
          <View style={styles.pulsingDot} />
        </View>
      );
    }
    if (isSpoken) {
      return (
        <View style={[styles.pinCircle, styles.pinSpoken]}>
          <Mic size={11} color="#092012" strokeWidth={2.4} />
        </View>
      );
    }
    return (
      <View style={[styles.pinCircle, styles.pinUpcoming]}>
        <View style={styles.upcomingDot} />
      </View>
    );
  };

  return (
    <View style={styles.rowContainer}>
      {/* Vertical guideline rail */}
      <View style={styles.guidelineWrapper}>
        <View
          style={[
            styles.guideline,
            isFirst && styles.guidelineFirst,
            isLast && styles.guidelineLast,
          ]}
        />
        {renderTimelinePin()}
      </View>

      {/* Content Card */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPressCard?.(item)}
        style={[
          styles.card,
          isInProgress && styles.cardActiveRing,
          isCompleted && styles.cardCompleted,
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.timeCategory,
              isCompleted && styles.timeCategoryCompleted,
              isInProgress && styles.timeCategoryActive,
            ]}
          >
            {item.time} • {item.category}
          </Text>
          {renderBadge()}
        </View>

        {/* Title */}
        <Text
          style={[styles.cardTitle, isCompleted && styles.cardTitleCompleted]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        {item.description ? (
          <Text style={styles.cardDesc}>{item.description}</Text>
        ) : null}

        {/* Quick action buttons for active in-progress items */}
        {isInProgress && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onToggleComplete?.(item.id)}
              style={styles.markCompleteBtn}
            >
              <Text style={styles.markCompleteText}>Mark Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onExtendMinutes?.(item.id)}
              style={styles.extendBtn}
            >
              <Text style={styles.extendText}>+15 mins</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guidelineWrapper: {
    width: 32,
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'stretch',
  },
  guideline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E4E2DD',
  },
  guidelineFirst: {
    top: 14,
  },
  guidelineLast: {
    bottom: '60%',
  },
  pinCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  pinCompleted: {
    backgroundColor: '#CCE6D0',
  },
  pinInProgress: {
    backgroundColor: '#010102',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FBF9F3',
  },
  pinSpoken: {
    backgroundColor: '#CEE9D3',
  },
  pinUpcoming: {
    backgroundColor: '#E4E2DD',
  },
  upcomingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#77767B',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(234, 232, 226, 0.7)',
  },
  cardActiveRing: {
    borderColor: 'rgba(1, 1, 2, 0.12)',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardCompleted: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeCategory: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#77767B',
  },
  timeCategoryCompleted: {
    color: '#354C3B',
  },
  timeCategoryActive: {
    color: '#010102',
    fontFamily: Fonts.poppins.semiBold,
  },
  workBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#46464A',
  },
  voicePrepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EDE3B8',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  voicePrepBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#201C02',
  },
  mintBadge: {
    backgroundColor: '#CEE9D3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  mintBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#092012',
  },
  neutralBadge: {
    backgroundColor: '#F0EEE8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  neutralBadgeText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#77767B',
  },
  cardTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 15,
    color: '#1B1C19',
    lineHeight: 20,
  },
  cardTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#77767B',
  },
  cardDesc: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 17,
    color: '#5F5E60',
    marginTop: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  markCompleteBtn: {
    backgroundColor: '#010102',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markCompleteText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  extendBtn: {
    backgroundColor: '#F0EEE8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  extendText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11.5,
    color: '#1B1C19',
  },
});

export default TimelineItemCard;
