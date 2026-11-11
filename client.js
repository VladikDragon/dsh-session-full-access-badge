window.__ModuleLoader__.load({
	id: 'dsh-session-full-access-badge',
	factory(require) {
		const React = require('react');
		const primitives = require('@deepseek-ai/dsh-client-ui-primitives');

		const NS = 'sessionFullAccessBadge';

		/** Machine value of the preset whose GUI seat shows the Full access mark. */
		const FULL_ACCESS_PRESET = 'danger-full-access';

		const DICTIONARIES = {
			en: {
				'mark.label': 'Full access is on for this session',
			},
			ru: {
				'mark.label': 'Для этой сессии включён полный доступ',
			},
			zh: {
				'mark.label': '此会话已启用完全权限',
			},
		};

		/**
		 * The 16px trailing cell the row reserves between its update time and its
		 * pin marker; the glyph inside stays 14px, like the picker row's own icon.
		 */
		const markStyle = {
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 16,
			height: 20,
			flex: 'none',
			color: 'var(--dsw-alias-label-secondary, currentColor)',
		};

		/**
		 * Non-interactive Full access mark for one Session row. It reads only the
		 * listed Session's own `permissions` projection value, so it never retains,
		 * opens, or otherwise activates the Session it marks.
		 * @param props.sessionId - the Session whose row shows this seat.
		 * @param props.useSessions - root Session catalog hook supplied by the row.
		 * @param props.t - this namespace's locale seat.
		 * @returns the shield mark while the Session's preset is Full access.
		 */
		function SessionFullAccessMark({ sessionId, useSessions, t }) {
			const preset = useSessions(
				(state) => state.byId[sessionId]?.projectionValues?.permissions?.currentValue,
			);
			if (preset !== FULL_ACCESS_PRESET) return null;
			const label = t('mark.label');
			return React.createElement(
				'span',
				{
					style: markStyle,
					role: 'img',
					'aria-label': label,
					title: label,
					'data-session-full-access': '',
				},
				React.createElement(primitives.PermissionIconFullAccessRegular, { size: 14 }),
			);
		}

		return {
			inject: ['slots', 'locale'],
			apply(ctx) {
				ctx.effect(
					() => ctx.locale.register(NS, DICTIONARIES),
					'session-full-access-badge: dictionaries',
				);
				ctx.slots.inject('sidebar.session.row.trailing', () =>
					ctx.slots.register(
						{
							name: 'sidebar.session.row.trailing',
							id: 'full-access-mark',
							order: 10,
							locale: NS,
						},
						SessionFullAccessMark,
					),
				);
			},
		};
	},
});