import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {MapSettingItem, SettingOption, useContextMenu} from '@ui/hooks/useContextMenu';
import {usePhoneConfig} from '../../../config/hooks/usePhoneConfig';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import {SettingItem, SettingItemIconAction, SettingItemSlider, SettingSwitch, SoundItem,} from './SettingItem';
import {useTranslation} from 'react-i18next';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Brush,
  DeleteForever,
  FilterList,
  LibraryMusic,
  Phone,
  Share,
  Smartphone,
  VolumeUp,
  Wallpaper,
  ZoomIn,
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {useResetSettings, useSettings} from '../hooks/useSettings';
import {useSnackbar} from '@os/snackbar/hooks/useSnackbar';
import {IContextMenuOption} from '@ui/components/ContextMenu';
import WallpaperModal from './WallpaperModal';
import {SettingsCategory} from './SettingsCategory';
import {IconSetObject, SettingEvents} from '@typings/settings';
import {useApp} from '@os/apps/hooks/useApps';
import {useCustomWallpaperModal} from '../state/customWallpaper.state';
import fetchNui from '@utils/fetchNui';
import {useCustomEvent} from '@os/events/useCustomEvents';

const useStyles = makeStyles({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
});

export const SettingsApp: React.FC = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = usePhoneConfig();
  const myNumber = useMyPhoneNumber();
  const [settings, setSettings] = useSettings();
  const [t] = useTranslation();
  const [customWallpaperState, setCustomWallpaperState] = useCustomWallpaperModal();
  const dispatchEvent = useCustomEvent('themeChanged', {});

  const {addAlert} = useSnackbar();

  const resetSettings = useResetSettings();

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({...settings, [key]: value});

    if (key === 'theme') {
      dispatchEvent(value);
    }
  };

  const iconSets = config.iconSet.map(
    MapSettingItem(settings.iconSet, (val: SettingOption<IconSetObject>) =>
      handleSettingChange('iconSet', val),
    ),
  );

  const wallpapers = config.wallpapers.map(
    MapSettingItem(settings.wallpaper, (val: SettingOption) =>
      handleSettingChange('wallpaper', val),
    ),
  );
  const frames = config.frames.map(
    MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
  );
  const themes = config.themes.map(
    MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val)),
  );
  const zoomOptions = config.zoomOptions.map(
    MapSettingItem(settings.zoom, (val: SettingOption) => handleSettingChange('zoom', val)),
  );
  const ringtones = config.ringtones.map(
    MapSettingItem(settings.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val)),
  );
  const notifications = config.notiSounds.map(
    MapSettingItem(settings.notiSound, (val: SettingOption) =>
      handleSettingChange('notiSound', val),
    ),
  );

  const twitterNotifications = config.notiSounds.map(
    MapSettingItem(settings.TWITTER_notiSound, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiSound', val),
    ),
  );

  const twitterNotificationFilters = config.notiFilters.map(
    MapSettingItem(settings.TWITTER_notiFilter, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiFilter', val),
    ),
  );

  const languages = config.languages.map(
    MapSettingItem(settings.language, (val: SettingOption) => handleSettingChange('language', val)),
  );

  const handleResetOptions = () => {
    resetSettings();
    addAlert({
      message: t('SETTINGS.MESSAGES.SETTINGS_RESET'),
      type: 'success',
    });
  };

  const resetSettingsOpts: IContextMenuOption[] = [
    {
      selected: false,
      onClick: () => handleResetOptions(),
      key: 'RESET_SETTINGS',
      label: t('SETTINGS.OPTIONS.RESET_SETTINGS'),
    },
  ];

  const customWallpaper: IContextMenuOption = {
    selected: false,
    onClick: () => setCustomWallpaperState(true),
    key: 'CUSTOM_WALLPAPER',
    label: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE'),
  };

  const handleShareContact = () => {
    fetch('https://k_npwd_config/k_npwd_config:share_my_number', {
      method: 'post', headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify({number: myNumber})
    }).then(response => response.json())
      .then(response => {
      if (response) {
        if (!response.ok) {
          addAlert({
            message: 'Nenhum celular próximo!',
            type: 'warning',
          });
        }
      } else {
        addAlert({
          message: 'Número compartilhado!',
          type: 'success',
        });
      }
    }).catch(ex => {
      addAlert({
        message: 'Erro ao compartilhar seu número!',
        type: 'error',
      });
    });
  }

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  const classes = useStyles();

  return (
    <AppWrapper>
      <AppTitle app={settingsApp}/>
      {/* Used for picking and viewing a custom wallpaper */}
      <WallpaperModal/>
      <div className={customWallpaperState ? classes.backgroundModal : undefined}/>
      {/*
        Sometimes depending on the height of the app, we sometimes want it to fill its parent
        and other times we want it to grow with the content. AppContent implementation currently
        has a style of height: 100%, attached to its main class. We overwrite this here by
        passing a style prop of height: 'auto'. This isn't ideal but it works without breaking
        any of the other apps.

        This also fixes Material UI v5's background color properly
      */}
      <AppContent
        backdrop={isMenuOpen}
        onClickBackdrop={closeMenu}
        display="flex"
        style={{
          height: 'auto',
        }}
      >
        <SettingsCategory title={t('SETTINGS.CATEGORY.PHONE')}>
          <SettingItemIconAction
            label={t('SETTINGS.PHONE_NUMBER')}
            labelSecondary={myNumber}
            actionLabel={'Compartilhar contato'}
            icon={<Phone/>}
            actionIcon={<Share/>}
            handleAction={handleShareContact}
          />
          <SoundItem
            label={t('SETTINGS.OPTIONS.RINGTONE')}
            value={settings.ringtone.label}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic/>}
            tooltip={t('SETTINGS.PREVIEW_SOUND')}
            onPreviewClicked={() => {
              fetchNui(SettingEvents.PREVIEW_RINGTONE);
            }}
          />
          <SoundItem
            label={t('SETTINGS.OPTIONS.NOTIFICATION')}
            value={settings.notiSound.label}
            options={notifications}
            onClick={openMenu}
            icon={<LibraryMusic/>}
            tooltip={t('SETTINGS.PREVIEW_SOUND')}
            onPreviewClicked={() => {
              fetchNui(SettingEvents.PREVIEW_ALERT);
            }}
          />
          <SettingSwitch
            label={t('SETTINGS.OPTIONS.STREAMER_MODE.TITLE')}
            secondary={t('SETTINGS.OPTIONS.STREAMER_MODE.DESCRIPTION')}
            icon={<VisibilityOffIcon/>}
            value={settings.streamerMode}
            onClick={(curr) => handleSettingChange('streamerMode', !curr)}
          />
          <SettingItemSlider
            label={t('SETTINGS.OPTIONS.CALL_VOLUME')}
            icon={<VolumeUp/>}
            value={settings.callVolume}
            onCommit={(_, val) => handleSettingChange('callVolume', val)}
          />
        </SettingsCategory>
        <SettingsCategory title={t('SETTINGS.CATEGORY.APPEARANCE')}>
          {/*<SettingItem*/}
          {/*  label={t('SETTINGS.OPTIONS.LANGUAGE')}*/}
          {/*  value={settings.language.label}*/}
          {/*  options={languages}*/}
          {/*  onClick={openMenu}*/}
          {/*  icon={<Book />}*/}
          {/*/>*/}
          <SettingItem
            label={t('SETTINGS.OPTIONS.THEME')}
            value={settings.theme.label}
            options={themes}
            onClick={openMenu}
            icon={<Brush/>}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.WALLPAPER')}
            value={settings.wallpaper.label}
            options={[...wallpapers, customWallpaper]}
            onClick={openMenu}
            icon={<Wallpaper/>}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.FRAME')}
            value={settings.frame.label}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone/>}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.ZOOM')}
            value={settings.zoom.label}
            options={zoomOptions}
            onClick={openMenu}
            icon={<ZoomIn/>}
          />
        </SettingsCategory>
        <SettingsCategory title={t('APPS_TWITTER')}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.NOTIFICATION_FILTER')}
            value={settings.TWITTER_notiFilter.label}
            options={twitterNotificationFilters}
            onClick={openMenu}
            icon={<FilterList/>}
          />
          <SettingItem
            label={t('SETTINGS.OPTIONS.NOTIFICATION')}
            value={settings.TWITTER_notiSound.label}
            options={twitterNotifications}
            onClick={openMenu}
            icon={<LibraryMusic/>}
          />
          <SettingItemSlider
            label={t('SETTINGS.OPTIONS.NOTIFICATION_VOLUME')}
            value={settings.TWITTER_notiSoundVol}
            onCommit={(e, val) => handleSettingChange('TWITTER_notiSoundVol', val)}
            icon={<VolumeUp/>}
          />
        </SettingsCategory>
        <SettingsCategory title={t('APPS_MARKETPLACE')}>
          <SettingSwitch
            label={t('SETTINGS.MARKETPLACE.NOTIFICATION')}
            secondary={t('SETTINGS.MARKETPLACE.NOTIFY_NEW_LISTING')}
            value={settings.MARKETPLACE_notifyNewListing}
            icon={<FilterList/>}
            onClick={(curr) => handleSettingChange('MARKETPLACE_notifyNewListing', !curr)}
          />
        </SettingsCategory>
        <SettingsCategory title={t('SETTINGS.CATEGORY.ACTIONS')}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
            value={t('SETTINGS.OPTIONS.RESET_SETTINGS_DESC')}
            icon={<DeleteForever/>}
            onClick={openMenu}
            options={resetSettingsOpts}
          />
        </SettingsCategory>
      </AppContent>
      <ContextMenu/>
    </AppWrapper>
  );
};
