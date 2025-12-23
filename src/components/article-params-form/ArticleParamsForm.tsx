import React, { useRef, useState, useEffect, RefObject } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	fontColors,
	fontFamilyOptions,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';

// Хук useOutsideClickClose

type UseOutsideClickCloseProps = {
	isOpen: boolean;
	rootRef: RefObject<HTMLElement>;
	onClose: () => void;
	onChange: (open: boolean) => void;
};

// Обработка клика вне формы

export const useOutsideClickClose = ({
	isOpen,
	rootRef,
	onClose,
	onChange,
}: UseOutsideClickCloseProps) => {
	useEffect(() => {
		if (!isOpen) {
			console.log('Форма закрыта, обработчик не подключается');
			return; // не подключаем обработчик, если форма закрыта
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				console.log('Клик вне формы. Закрываем.');
				onClose();
				onChange(false);
			} else {
				console.log('Клик внутри формы');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, rootRef, onClose, onChange]);
};

// Пропсы

export type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setCurrentArticleState: (data: ArticleStateType) => void;
};

// Основная функция

export const ArticleParamsForm = ({
	currentArticleState,
	setCurrentArticleState,
}: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [formState, setFormState] =
		useState<ArticleStateType>(currentArticleState);

	// Ref для клика вне формы
	const rootRef = useRef<HTMLDivElement>(null);

	// Обработка клика вне формы
	useOutsideClickClose({
		isOpen: isMenuOpen,
		rootRef,
		onClose: () => {
			setIsMenuOpen(false);
		},
		onChange: (open) => {
			setIsMenuOpen(open);
		},
	});

	// Отправка формы
	const submitForm = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentArticleState(formState);
		setIsMenuOpen(false); // закрываем форму после применения
	};

	// Сброс формы
	const resetForm = (e: React.FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		setCurrentArticleState(defaultArticleState);
	};

	// Обновление поля формы
	const changeForm = (
		field: keyof ArticleStateType,
		value: ArticleStateType[keyof ArticleStateType] // можно указать более точный тип из данных
	) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<>
			{/* Кнопка для открытия/закрытия меню */}
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>

			{/* Контейнер формы */}
			<aside
				ref={rootRef}
				className={`${styles.container} ${
					isMenuOpen ? styles.container_open : ''
				}`}>
				<form className={styles.form} onSubmit={submitForm} onReset={resetForm}>
					<Text size={31} uppercase weight={800}>
						Задайте параметры
					</Text>

					{/* Выбор шрифта */}
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(opt) => changeForm('fontFamilyOption', opt)}
					/>

					{/* Размер шрифта */}
					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(opt) => changeForm('fontSizeOption', opt)}
					/>

					{/* Цвет шрифта */}
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(opt) => changeForm('fontColor', opt)}
					/>

					<Separator />

					{/* Цвет фона */}
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(opt) => changeForm('backgroundColor', opt)}
					/>

					{/* Ширина контента */}
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(opt) => changeForm('contentWidth', opt)}
					/>

					{/* Кнопки */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
