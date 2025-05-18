"use client";

import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { formatDateWithTimeZone, getRelativeTime } from "@/lib/date-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import nextIntlConfig from "@/next-intl.config";

// Sample component to demonstrate the date and time formatting with timezone
export default function DateTimeExample() {
  // Use the next-intl formatter for date formatting
  const format = useFormatter();
  const t = useTranslations('i18n');

  // Sample dates to format
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">
        {t('description')}
        <span className="ml-1">{t('currentTimeZone')}</span> <Badge variant="outline">{nextIntlConfig.timeZone}</Badge>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('nextIntlFormatters')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('currentDateTime')}</h3>
              <p>{format.dateTime(now, { dateStyle: 'full', timeStyle: 'long' })}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('shortFormat')}</h3>
              <p>{format.dateTime(now, { dateStyle: 'short', timeStyle: 'short' })}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('differentDates')}</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">{t('yesterday')} </span>
                  {format.dateTime(yesterday)}
                </li>
                <li><span className="text-muted-foreground">{t('lastWeek')} </span>
                  {format.dateTime(lastWeek)}
                </li>
                <li><span className="text-muted-foreground">{t('nextMonth')} </span>
                  {format.dateTime(nextMonth)}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('relativeTime')}</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">{t('yesterday')} </span>
                  {format.relativeTime(yesterday)}
                </li>
                <li><span className="text-muted-foreground">{t('lastWeek')} </span>
                  {format.relativeTime(lastWeek)}
                </li>
                <li><span className="text-muted-foreground">{t('nextMonth')} </span>
                  {format.relativeTime(nextMonth)}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('customDateUtils')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('withTimeZone')}</h3>
              <p>{formatDateWithTimeZone(now, {
                dateStyle: 'full',
                timeStyle: 'long',
              })}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('differentTimeZones')}</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">{t('timezone.utc')}: </span>
                  {formatDateWithTimeZone(now, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                  }, 'UTC')}
                </li>
                <li><span className="text-muted-foreground">{t('timezone.newYork')}: </span>
                  {formatDateWithTimeZone(now, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                  }, 'America/New_York')}
                </li>
                <li><span className="text-muted-foreground">{t('timezone.tokyo')}: </span>
                  {formatDateWithTimeZone(now, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                  }, 'Asia/Tokyo')}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('relativeTime')}</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">{t('yesterday')}: </span>
                  {getRelativeTime(yesterday)}
                </li>
                <li><span className="text-muted-foreground">{t('lastWeek')}: </span>
                  {getRelativeTime(lastWeek)}
                </li>
                <li><span className="text-muted-foreground">{t('nextMonth')}: </span>
                  {getRelativeTime(nextMonth)}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{t('numberFormatting')}</h2>
        <Card>
          <CardContent className="py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('decimal')}</h3>
              <p>{format.number(1234567.89)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('currency')}</h3>
              <p>{format.number(1234567.89, { style: 'currency', currency: 'USD' })}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('percent')}</h3>
              <p>{format.number(0.7654, { style: 'percent' })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="text-sm text-muted-foreground">
        <p>
          {t.rich('footer', {
            timezone: nextIntlConfig.timeZone
          })}
        </p>
      </div>
    </div>
  );
}
